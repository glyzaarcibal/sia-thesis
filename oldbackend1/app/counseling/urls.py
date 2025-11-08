# basic URL Configurations
from django.urls import include, path
# import routers
from rest_framework import routers

from .views import (
    AnalysisQuizView, ChatViewSet, MessageViewSet, UserViewSet, UserProfileView,
    AnalysisView, save_analysis_result, get_analysis_result,
    SendOTPView, VerifyOTPView, BreathingSessionView, SleepEntryListCreate, SleepEntryDelete,
    MoodEntryListCreateView, AllSleepEntriesViewSet, AllUsersWithProfileView, DiaryListCreateView, DiaryDetailView, SleepEntryByUserView, MoodEntryByUserView,BreathingSessionByUserView,AllChatLogsView, AllMessagesView, AllCounselingAnalysesView,
    AllUserAnalysesView, AllBreathingSessionsView, AllSleepEntriesView,
    AllMoodEntriesView, AllDiariesView, AllUserProfilesView

)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


# define the router
router = routers.DefaultRouter()
router.register(r'Chat', ChatViewSet)
router.register(r'Message', MessageViewSet)
router.register(r'User', UserViewSet)

# specify URL Path for rest_framework
urlpatterns = [
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'), 
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/user/profile/', UserProfileView.as_view(), name='user_profile'),
    path('api/analysis/', AnalysisView.as_view(), name='quiz_analysis'),
    path('api/save-analysis/', save_analysis_result, name='save-analysis'),
    path('analysis/', AnalysisQuizView.as_view(), name='analysis'),
    path('get-analysis/<int:user_id>/', get_analysis_result, name='get-analysis'),
    path('send-otp/', SendOTPView.as_view(), name='send_otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    

    path('diary/', DiaryListCreateView.as_view(), name='diary-list-create'),
    path('diary/<int:pk>/', DiaryDetailView.as_view(), name='diary-detail'),
    path('mood-tracker/user/<str:user_id>/', MoodEntryByUserView.as_view(), name='mood-entry-by-user'),
    path('breathing-sessions/user/<str:user_id>/', BreathingSessionByUserView.as_view(), name='breathing-session-by-user'),
    path('mood-tracker/', MoodEntryListCreateView.as_view(), name='mood-tracker'),
    path('api/breathing-sessions/', BreathingSessionView.as_view(), name='breathing_sessions'),
    path('sleep-tracker/', SleepEntryListCreate.as_view(), name='sleep-list-create'),
    path('sleep-tracker-all/', AllSleepEntriesViewSet.as_view({'get': 'list'}), name='sleep-tracker-all'),
    path('api/users-with-profiles/', AllUsersWithProfileView.as_view(), name='users-with-profiles'),
    path('sleep-tracker/<int:pk>/', SleepEntryDelete.as_view(), name='sleep-delete'),
    path('sleep-tracker/user/<str:user_id>/', SleepEntryByUserView.as_view(), name='sleep-entry-by-user'),
    path('api/all-chatlogs/', AllChatLogsView.as_view(), name='all-chatlogs'),
    path('api/all-messages/', AllMessagesView.as_view(), name='all-messages'),
    path('api/all-counseling-analyses/', AllCounselingAnalysesView.as_view(), name='all-counseling-analyses'),
    path('api/all-user-analyses/', AllUserAnalysesView.as_view(), name='all-user-analyses'),
    path('api/all-breathing-sessions/', AllBreathingSessionsView.as_view(), name='all-breathing-sessions'),
    path('api/all-sleep-entries/', AllSleepEntriesView.as_view(), name='all-sleep-entries'),
    path('api/all-mood-entries/', AllMoodEntriesView.as_view(), name='all-mood-entries'),
    path('api/all-diaries/', AllDiariesView.as_view(), name='all-diaries'),
    path('api/all-user-profiles/', AllUserProfilesView.as_view(), name='all-user-profiles'),
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
