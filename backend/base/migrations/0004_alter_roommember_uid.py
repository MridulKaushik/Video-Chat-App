# Generated by Django 4.1.4 on 2023-09-19 05:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0003_alter_roommember_uid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='roommember',
            name='Uid',
            field=models.CharField(max_length=300, unique=True),
        ),
    ]
