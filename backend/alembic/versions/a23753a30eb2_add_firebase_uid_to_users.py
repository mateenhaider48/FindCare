
"""add firebase uid to users

Revision ID: a23753a30eb2
Revises: b6b60c6c77f8
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "a23753a30eb2"
down_revision: Union[str, Sequence[str], None] = "b6b60c6c77f8"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "users",
        sa.Column("firebase_uid", sa.String(length=128), nullable=True),
    )

    op.create_index(
        "ix_users_firebase_uid",
        "users",
        ["firebase_uid"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        "ix_users_firebase_uid",
        table_name="users",
    )

    op.drop_column("users", "firebase_uid")
