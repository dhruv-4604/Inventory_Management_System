# Generated by Django 5.1 on 2024-09-20 16:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0035_customer_created_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='company',
            name='address',
            field=models.TextField(blank=True, default=' ', null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='bank_account_number',
            field=models.CharField(blank=True, default='124567890', max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='bank_name',
            field=models.CharField(blank=True, default='My Bank', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='city',
            field=models.CharField(blank=True, default=' ', max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='company_name',
            field=models.CharField(default='My Company', max_length=255),
        ),
        migrations.AlterField(
            model_name='company',
            name='gst_number',
            field=models.CharField(blank=True, default='VAT0000', max_length=15, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='ifsc_code',
            field=models.CharField(blank=True, default=' ', max_length=11, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='pincode',
            field=models.CharField(blank=True, default=' ', max_length=10, null=True),
        ),
        migrations.AlterField(
            model_name='company',
            name='state',
            field=models.CharField(blank=True, default=' ', max_length=100, null=True),
        ),
    ]
