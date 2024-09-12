from django.urls import path
from api.views import ItemListView, RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView, UserDetailsAPIView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/user/', UserDetailsAPIView.as_view(), name='token_refresh'),
    path('token/items/',ItemListView.as_view(),name='items'),
]
