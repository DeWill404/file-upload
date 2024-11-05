import enum


class FileUploadEnum(int, enum.Enum):
    STARTED = 1
    FAILED = 2
    CANCELED = 3
    COMPLETED = 4


class FileAccessEnum(int, enum.Enum):
    OWENED = 1
    SHARED = 2
    PUBLIC = 3
