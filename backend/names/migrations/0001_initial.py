# Generated by Django 5.1.4 on 2025-03-15 17:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Appliance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('entity_id', models.CharField(max_length=255, unique=True)),
                ('name', models.CharField(max_length=255)),
            ],
        ),
    ]
