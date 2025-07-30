from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
import jwt
from dotenv import dotenv_values

class AdminTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        KEYS = dotenv_values()
        token = super().get_token(user)

        # Add custom claims here
        token['email'] = user.email

        return token