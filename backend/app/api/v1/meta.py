from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.core.security import require_authenticated_user
from app.models.user import AppUser

router = APIRouter(tags=["Metadata"])

class DepartmentResponse(BaseModel):
    id: str
    code: str
    name: str
    description: str

class DomainResponse(BaseModel):
    id: str
    code: str
    name: str
    description: str

DEPARTMENTS = [
    {
        "id": "dept-agri",
        "code": "ASD",
        "name": "Agricultural Statistics Division",
        "description": "Formulation, collection, and analysis of crop yields, land usage, and agricultural census data."
    },
    {
        "id": "dept-econ",
        "code": "ESD",
        "name": "Economic Statistics Division",
        "description": "Index of Industrial Production (IIP), Annual Survey of Industries (ASI), and economic census operations."
    },
    {
        "id": "dept-social",
        "code": "SSD",
        "name": "Social Statistics Division",
        "description": "Social indicators, gender statistics, environment statistics, and sustainable development goals (SDGs)."
    },
    {
        "id": "dept-dpd",
        "code": "DPD",
        "name": "Data Processing Division",
        "description": "Data entry, validation, tabulation, data clearing, and electronic data processing systems."
    },
    {
        "id": "dept-sdrd",
        "code": "SDRD",
        "name": "Survey Design and Research Division",
        "description": "Sampling design, questionnaire design, field instructions, and survey methodology research."
    },
    {
        "id": "dept-nad",
        "code": "NAD",
        "name": "National Accounts Division",
        "description": "Compilation of Gross Domestic Product (GDP), State Domestic Product, and national accounts aggregation."
    }
]

DOMAINS = [
    {
        "id": "dom-agri",
        "code": "AGRI_STAT",
        "name": "Agricultural Statistics",
        "description": "Crop estimation, agricultural census methodology, remote sensing applications, and field survey techniques."
    },
    {
        "id": "dom-econ",
        "code": "ECON_STAT",
        "name": "Economic Statistics",
        "description": "Industrial classification, macroeconomic indicators, index compilation, and enterprise surveys."
    },
    {
        "id": "dom-survey",
        "code": "SURVEY_METH",
        "name": "Survey Methodology",
        "description": "Probability sampling, stratification, estimation errors, non-sampling error control, and survey design."
    },
    {
        "id": "dom-official",
        "code": "OFFICIAL_STAT",
        "name": "Official Statistics Framework",
        "description": "Core Statistics Act, Fundamental Principles of Official Statistics, data ethics, and statistical governance."
    },
    {
        "id": "dom-data",
        "code": "DATA_ENG",
        "name": "Data Analytics & Engineering",
        "description": "SQL querying, Python data science, statistical computing (R/Stata), automated data validation pipelines."
    },
    {
        "id": "dom-geo",
        "code": "GIS_STAT",
        "name": "Geospatial & GIS Statistics",
        "description": "Spatial analysis, satellite imagery integration, census enumeration area mapping, and GIS statistics."
    }
]

@router.get("/departments", response_model=List[DepartmentResponse], summary="List Official Departments")
def list_departments(current_user: AppUser = Depends(require_authenticated_user)):
    return DEPARTMENTS

@router.get("/domains", response_model=List[DomainResponse], summary="List Statistical Domains")
def list_domains(current_user: AppUser = Depends(require_authenticated_user)):
    return DOMAINS
