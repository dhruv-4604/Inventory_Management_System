from django.urls import path
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from api.views import DeleteItemView,CustomerListView, ItemListView, RegisterView, CustomTokenObtainPairView, CustomTokenRefreshView, SaleOrderView, UserDetailsAPIView, VendorListView, SaleOrderView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('register/', RegisterView.as_view(), name='register'),
    path('token/', CustomTokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('token/user/', UserDetailsAPIView.as_view(), name='token_refresh'),
    path('token/items/',ItemListView.as_view(),name='items'),
    path('token/items/delete/<str:item_id>',DeleteItemView.as_view(),name='delete_item'),
    path('customers/', CustomerListView.as_view(), name='customer-list'),
    path('token/vendors/', VendorListView.as_view(), name='vendors'),
    path('token/saleorders/', SaleOrderView.as_view(), name='sale-orders'),
    path('token/saleorders/<str:sale_order_id>/', SaleOrderView.as_view(), name='update-sale-order'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
