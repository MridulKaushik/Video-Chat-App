# Generated by Django 4.1.4 on 2023-09-19 05:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='RoomMember',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=34)),
                ('Uid', models.IntegerField()),
                ('RoomName', models.CharField(max_length=50)),
            ],
        ),
        migrations.DeleteModel(
            name='User',
        ),
    ]
