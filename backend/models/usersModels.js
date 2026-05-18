const { prisma } = require('../lib/prisma');

async function findAllUsers() {
    return prisma.users.findMany({
        select: {
            UserID: true,
            FullName: true,
            Birthdate: true,
            Email: true,
            IsPublicProfile: true
        }
    });
}

async function findUserByID(id) {
    return (await prisma.users.findUnique({
        where: {
            UserID: parseInt(id)
        },
        select: {
            UserID: true,
            FullName: true,
            Birthdate: true,
            Email: true,
            IsPublicProfile: true
        }
    })) || null;
}

async function findUserByEmail(email) {
    return (await prisma.users.findUnique({
        where: {
            Email: email
        }
    })) || null;
}

async function addUser(FullName, Email, Password, Birthdate) {
    return prisma.users.create({
        data: {
            FullName: FullName,
            Email: Email,
            Password: Password,
            Birthdate: Birthdate ? new Date(Birthdate) : null
        },
        select: {
            UserID: true,
            FullName: true,
            Birthdate: true,
            Email: true,
            IsPublicProfile: true
        }
    });
}

async function removeUser(removedID) {
    try {
        await prisma.users.delete({
            where: {
                UserID: parseInt(removedID)
            }
        });
        return 1;
    } catch (error) {
        return 0;
    }
}

async function editUser(UserID, FullName, Birthdate, Email, Password, IsPublicProfile) {
    try {
        await prisma.users.update({
            where: {
                UserID: parseInt(UserID)
            },
            data: {
                FullName: FullName,
                Birthdate: Birthdate ? new Date(Birthdate) : undefined,
                Email: Email,
                Password: Password,
                IsPublicProfile: IsPublicProfile === true || IsPublicProfile === 1 || IsPublicProfile === 'true'
            }
        });
        return 1;
    } catch (error) {
        return 0;
    }
}

module.exports = { findAllUsers, findUserByID, findUserByEmail, addUser, editUser, removeUser };