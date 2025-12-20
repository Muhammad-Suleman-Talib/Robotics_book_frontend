import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List

from backend.src.core.config import settings

class EmailService:
    def __init__(self):
        self.smtp_server = settings.SMTP_SERVER
        self.smtp_port = settings.SMTP_PORT
        self.smtp_username = settings.SMTP_USERNAME
        self.smtp_password = settings.SMTP_PASSWORD
        self.sender_email = settings.SENDER_EMAIL
        self.base_url = settings.BASE_URL # For constructing verification links

    async def send_verification_email(self, recipient_email: str, verification_token: str):
        subject = "Verify Your Email Address"
        verification_link = f"{self.base_url}/api/verify-email/{verification_token}" # Adjusted path
        body = f"""
        <html>
            <body>
                <p>Hi there,</p>
                <p>Thank you for registering. Please click the link below to verify your email address:</p>
                <p><a href="{verification_link}">Verify Email</a></p>
                <p>If you did not register for this service, please ignore this email.</p>
                <p>Thanks,</p>
                <p>Your App Team</p>
            </body>
        </html>
        """
        await self._send_email(recipient_email, subject, body)

    async def send_password_reset_email(self, recipient_email: str, reset_token: str):
        subject = "Password Reset Request"
        reset_link = f"{self.base_url}/reset-password?token={reset_token}" # Assuming frontend route
        body = f"""
        <html>
            <body>
                <p>Hi there,</p>
                <p>You have requested a password reset. Please click the link below to reset your password:</p>
                <p><a href="{reset_link}">Reset Password</a></p>
                <p>This link is valid for 1 hour.</p>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thanks,</p>
                <p>Your App Team</p>
            </body>
        </html>
        """
        await self._send_email(recipient_email, subject, body)

    async def _send_email(self, recipient_email: str, subject: str, body: str):
        msg = MIMEMultipart("alternative")
        msg["From"] = self.sender_email
        msg["To"] = recipient_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "html"))

        try:
            with smtplib.SMTP_SSL(self.smtp_server, self.smtp_port) as server:
                server.login(self.smtp_username, self.smtp_password)
                server.send_message(msg)
        except Exception as e:
            # In a real application, you'd want robust error logging here
            print(f"Failed to send email: {e}")
            raise # Re-raise to ensure calling function knows email failed
