# Generated by Django 5.1 on 2024-09-15 13:28

import api.models
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0024_saleorder_customer_city_saleorder_customer_pincode_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Shipment',
            fields=[
                ('shipment_id', models.AutoField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('order_id', models.IntegerField()),
                ('customer_name', models.CharField(max_length=255)),
                ('carrier', models.CharField(max_length=50)),
                ('tracking_id', models.CharField(default=api.models.generate_tracking_id, max_length=11, unique=True, validators=[django.core.validators.MinLengthValidator(11)])),
                ('status', models.CharField(choices=[('IN_TRANSIT', 'In Transit'), ('DELIVERED', 'Delivered'), ('RETURNED', 'Returned')], default='IN_TRANSIT', max_length=20)),
            ],
        ),
    ]
