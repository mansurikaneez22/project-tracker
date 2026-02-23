from app.socket_instance import sio

class ConnectionManager:

    async def send_notification(self, user_id: int, data: dict):
        print("EMITTING TO ROOM:", user_id)

        await sio.emit(
            "new_notification",
            data,
            room=str(user_id)   # ⚠️ room must be string
        )

manager = ConnectionManager()