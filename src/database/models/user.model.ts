import {Table,Column,Model,DataType, PrimaryKey} from 'sequelize-typescript'


@Table({
    tableName: 'users',
    modelName: 'User',
    timestamps: true
})

class User extends Model{
    @Column({
        primaryKey : true,
        type : DataType.UUID,
        defaultValue: DataType.UUIDV4
    })
    declare id: string
    
    @Column({
        type : DataType.STRING
    })
    declare username: string

    @Column({
        type : DataType.STRING
    })
    declare password: string

    @Column({
        type : DataType.STRING,
        unique: true
    })
    declare email: string

    @Column({
        type : DataType.ENUM('teacher', 'institute', 'super-admin', 'student'),
        defaultValue: 'student'
    })
    declare role:string

    @Column({
        type : DataType.STRING
    })
    declare currentInstituteNumber: string

    /*
    single user can have multiple institutes
    ex: super-admin can have multiple institutes
    but for now we will just keep one institute per user
    and tyo user current kun institute ma cha bhanera
    */
}

export default User 