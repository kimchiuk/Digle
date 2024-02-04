from enum import Enum as pyEnum
from sqlalchemy import Table, Column, Integer, String, DateTime, Boolean, ForeignKey, Text, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
from database import Base  # database.py에서 Base 클래스를 임포

class RoomType(pyEnum):
    TestRoom = "TestRoom"
    Room = "Room"


# 참가자 연결 테이블 정의
room_participants = Table('room_participants', Base.metadata,
    Column('room_id', Integer, ForeignKey('room_info.id'), primary_key=True),
    Column('user_id', Integer, ForeignKey('users.id'), primary_key=True)
)

class RoomInfo(Base):
    __tablename__ = "room_info"

    id = Column(Integer, primary_key=True, index=True)
    room_title = Column(String, unique=True, index=True)
    host_name = Column(String, unique=True, index=True)
    create_time = Column(DateTime, default=datetime.utcnow)
    room_type = Column(SQLEnum(RoomType, name="room_type_enum"))


# 방장을 위한 관계 정의 (User 모델과의 외래 키 관계 필요)
    host_id = Column(Integer, ForeignKey('users.id'))
    host = relationship("User", back_populates="hosted_rooms")

    # 참가자들을 위한 다대다 관계 정의
    participants = relationship("User", secondary=room_participants, back_populates="participated_rooms")