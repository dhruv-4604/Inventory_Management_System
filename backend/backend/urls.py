from django.urls import path
from api.views import RegisterView
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import CustomTokenObtainPairView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
  	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
