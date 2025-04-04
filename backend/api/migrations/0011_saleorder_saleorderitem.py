# Generated by Django 5.1 on 2024-09-15 04:06

import django.core.validators
import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0010_remove_purchaseorderitem_item_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='SaleOrder',
            fields=[
                ('sale_order_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('mode_of_delivery', models.CharField(choices=[('PICKUP', 'Pickup'), ('DELIVERY', 'Delivery')], max_length=10)),
                ('carrier', models.CharField(choices=[('FEDEX', 'FedEx'), ('UPS', 'UPS'), ('USPS', 'USPS'), ('DHL', 'DHL'), ('OTHER', 'Other')], max_length=10)),
                ('payment_received', models.BooleanField(default=False)),
                ('discount', models.DecimalField(decimal_places=2, default=0, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=12, validators=[django.core.validators.MinValueValidator(0)])),
                ('customer', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_orders', to='api.customer')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sale_orders', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='SaleOrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('rate', models.DecimalField(decimal_places=2, max_digits=10, validators=[django.core.validators.MinValueValidator(0)])),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.item')),
                ('sale_order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='items', to='api.saleorder')),
            ],
        ),
    ]
