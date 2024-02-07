from enum import Enum as pyEnum
from sqlalchemy import Table, Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from database import Base  # database.py에서 Base 클래스를 임포


class RoomType(pyEnum):
    TestRoom = "TestRoom"
    Room = "Room"


class RoomInfo(Base):
    __tablename__ = "room_info"

    id = Column(Integer, primary_key=True, index=True)
    room_num = Column(Integer, unique=True, index=True)
    host_name = Column(String, index=True)
    create_time = Column(DateTime, default=datetime.utcnow)
    room_type = Column(SQLEnum(RoomType, name="room_type_enum"))
    invite_code = Column(String, index=True)

    # 방장을 위한 관계 정의 (User 모델과의 외래 키 관계 필요)
    host_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
