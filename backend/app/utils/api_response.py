from fastapi.responses import JSONResponse


class APIResponse:
    def __init__(self, res_code: int, msg: str = None, data: any = None) -> None:
        self.res_code = res_code
        self.message = msg
        self.data = data

    def send(self) -> JSONResponse:
        payload = dict()
        if self.message:
            payload["message"] = self.message
        if self.data:
            payload["data"] = self.data
        return JSONResponse(content=payload, status_code=self.res_code)
