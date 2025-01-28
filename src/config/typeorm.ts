import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { join } from "path";

export function TypeOrmConfig():TypeOrmModuleOptions{
    const{DB_HOST,DB_NAME,DB_PASSWORD,DB_PORT,DB_USERNAME}=process.env
    return{
        type:'mysql',
        port:DB_PORT,
        host:DB_HOST,
        database:DB_NAME,
        password:DB_PASSWORD,
        username:DB_USERNAME,
        autoLoadEntities:false,
        entities:[join(__dirname,"../module/**/entities/*.entity{.ts,.js}")],
        synchronize:true
    }
}