export type authItem = {
    username: string;
    password: string
}
export type getDistricts = {
    id: number;
    name: string;
    nameNP: string;
    namecombine: string;
    States: [
        id:number,
        name:string,
        namenp:string,
        
    ];
}