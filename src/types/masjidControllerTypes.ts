type AdhanCalcConfig = {
    id: number,
    name: string
  }
  
  type AdhanJuristicConfig = {
    id: number,
    name: string
  }
  
  type AdhanCustomConfig = {
    id: number,
    name: string,
    fajrAngle: number,
    maghribRule: string,
    maghribValue: string,
    ishaRule: string,
    ishaValue: string
  }
  
  export type AdhanConfig = {
    id: number,
    adhanCalcConfig: AdhanCalcConfig,
    adhanJuristicConfig: AdhanJuristicConfig,
    adhanCustomConfig: AdhanCustomConfig,
    createdBy: string,
    createdDate: string,
    updatedBy: string,
    updatedDate: string
  }

export type IqamahTime = {
    id: number;
    type: string;
    changeDate: string;
    fajr: string;
    dhuhr: string;
    asr: string;
    isha: string;
    fajrDelay: number | null;
    dhuhrDelay: number | null;
    maghribDelay: number | null;
    ishaDelay: number | null;
    createdBy: string;
    createdDate: string;
    asrDelay: number | null;
  }
  