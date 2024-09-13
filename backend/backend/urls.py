from django.urls import path
from django.contrib import admin

from api.views import DeleteItemView,CustomerListView, ItemListView, RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView, UserDetailsAPIView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/user/', UserDetailsAPIView.as_view(), name='token_refresh'),
    path('token/items/',ItemListView.as_view(),name='items'),
    path('token/items/delete/<str:item_id>',DeleteItemView.as_view(),name='delete_item'),
    path('customers/', CustomerListView.as_view(), name='customer-list'),
]
