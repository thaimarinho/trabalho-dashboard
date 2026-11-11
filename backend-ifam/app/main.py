from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.laboratorios import dashboard as dashboard_laboratorios

app = FastAPI(
    title="Backend IFAM - Sistema de Gestão de Laboratórios e Equipamentos",
    description="API para gestão de laboratórios, equipamentos, reservas e usuários do IFAM.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(dashboard_laboratorios.router)


@app.get("/", tags=["Health Check"])
def health_check():
    return {"status": "online", "service": "backend-ifam"}