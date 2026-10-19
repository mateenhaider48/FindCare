
"""remove password hash for firebase auth

Revision ID: 7c7cf0d87199
Revises: a23753a30eb2
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = "7c7cf0d87199"
down_revision: Union[str, Sequence[str], None] = "a23753a30eb2"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_column("users", "password_hash")


def downgrade() -> None:
    op.add_column(
        "users",
        sa.Column("password_hash", sa.String(length=255), nullable=True),
    )
