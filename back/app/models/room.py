from enum import Enum as pyEnum
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from database import Base  # database.py에서 Base 클래스를 임포

class RoomType(pyEnum):
    TestRoom = "TestRoom"
    Room = "Room"


class RoomInfo(Base):
    __tablename__ = "room_info"

    id = Column(Integer, primary_key=True, index=True)
    room_title = Column(String, unique=True, index=True)
    host_name = Column(String, unique=True, index=True)
    create_time = Column(DateTime, default=datetime.utcnow)
    room_type = Column(SQLEnum(RoomType, name="user_type_enum"))
