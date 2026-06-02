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

async function findSuggestions(userId) {
    
    const friends = await prisma.friends.findMany({
        where: {
            OR: [
                { UserID: parseInt(userId), Status: 'ACCEPTED' },
                { FriendID: parseInt(userId), Status: 'ACCEPTED' }
            ]
        }
    });

    const friendIds = friends.map((f) =>
        f.UserID === parseInt(userId) ? f.FriendID : f.UserID
    );

    return prisma.users.findMany({
        where: {
            UserID: {
                not: parseInt(userId),
                notIn: friendIds
            }
        },
        select: {
            UserID: true,
            FullName: true
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
        const dataToUpdate = {};
        if (FullName !== undefined) dataToUpdate.FullName = FullName;
        if (Birthdate !== undefined) dataToUpdate.Birthdate = Birthdate ? new Date(Birthdate) : null;
        if (Email !== undefined) dataToUpdate.Email = Email;
        if (Password !== undefined) dataToUpdate.Password = Password;
        if (IsPublicProfile !== undefined) dataToUpdate.IsPublicProfile = IsPublicProfile === true || IsPublicProfile === 1 || IsPublicProfile === 'true';

        if (Object.keys(dataToUpdate).length === 0) {
            return 0;
        }

        const result = await prisma.users.update({
            where: {
                UserID: parseInt(UserID)
            },
            data: dataToUpdate
        });
        return result ? 1 : 0;
    } catch (error) {
        console.error('editUser model error:', error);
        return 0;
    }
}

module.exports = { findAllUsers,findSuggestions, findUserByID, findUserByEmail, addUser, editUser, removeUser };