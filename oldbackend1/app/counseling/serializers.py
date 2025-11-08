# import serializer from rest_framework
from rest_framework import serializers
from datetime import datetime

# import model from models.py
from .models import ChatLog, Message, CounselingAnalysis, UserAnalysis, BreathingSession, SleepEntry, MoodEntry, Diary, UserProfile
from django.contrib.auth.models import User

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['gender', 'age', 'location', 'is_phone_verified']

class UserAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAnalysis
        fields = "__all__"

    def create(self, validated_data):
        request = self.context.get("request")  # Get request from context
        if request and request.user:
            validated_data["user"] = request.user
        return super().create(validated_data)



class PhoneSerializer(serializers.Serializer):
    phone = serializers.CharField()

class OTPVerificationSerializer(serializers.Serializer):
    phone = serializers.CharField()
    otp = serializers.CharField()

# Create a model serializer
# serializers.py
from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(write_only=True)
    isAdmin = serializers.BooleanField(source="is_staff", read_only=True)
    
    # These fields won't be stored in the User model
    gender = serializers.CharField(required=False, allow_null=True, default="", write_only=True)
    phone = serializers.CharField(required=False, allow_null=True, default="", write_only=True)
    phone_number = serializers.CharField(required=False, allow_null=True, default="", write_only=True)
    age = serializers.IntegerField(required=False, allow_null=True, write_only=True)
    location = serializers.CharField(required=False, allow_null=True, default="", write_only=True)
    is_phone_verified = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 
                  'isAdmin', 'gender', 'age', 'location', 'is_phone_verified', 'phone', 'phone_number']
        read_only_fields = ["is_phone_verified"]

    def create(self, validated_data):
        # Extract the non-User model fields
        gender = validated_data.pop('gender', '')
        
        # Handle both 'phone' and 'phone_number' fields, prioritizing 'phone'
        phone = validated_data.pop('phone', '')
        phone_number = validated_data.pop('phone_number', '')
        # Use 'phone' if provided, otherwise use 'phone_number'
        final_phone_number = phone if phone else phone_number
        
        age = validated_data.pop('age', None)
        location = validated_data.pop('location', '')
        
        password = validated_data.pop('password', None)
        if not password:
            raise serializers.ValidationError({"password": "Password is required."})

        user = User(**validated_data)
        user.set_password(password)
        user.save()
        
        # Create UserProfile for the new user
        UserProfile.objects.create(
            user=user,
            gender=gender,
            phone_number=final_phone_number,
            age=age,
            location=location,
            is_phone_verified=False
        )
        
        return user

class ChatLogSerializer(serializers.HyperlinkedModelSerializer):
	user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
	class Meta:
		model = ChatLog
		fields = ('id','user', 'date_created', 'last_updated')

class MessageSerializer(serializers.HyperlinkedModelSerializer):
	chat = serializers.PrimaryKeyRelatedField(queryset=ChatLog.objects.all())
	class Meta:
		model = Message
		fields = ('id','chat', 'from_user', 'message_content', 'date_created')
		
class CounselingAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = CounselingAnalysis
        fields = '__all__' 

class BreathingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = BreathingSession
        fields = ['id', 'duration', 'timestamp']  # No need to include 'user', it will be assigned automatically

    def create(self, validated_data):
        request = self.context.get('request')
        if request and hasattr(request, "user"):
            validated_data['user'] = request.user  # Assign user before creating
        return super().create(validated_data)


class SleepEntrySerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = SleepEntry
        fields = ['id', 'username', 'date', 'sleep_time', 'wake_time', 'duration']

class MoodEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = MoodEntry
        fields = ['id', 'user', 'mood', 'reason', 'timestamp']
        read_only_fields = ['user']

class DiarySerializer(serializers.ModelSerializer):
    class Meta:
        model = Diary
        fields = ['id', 'user', 'text', 'type', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
