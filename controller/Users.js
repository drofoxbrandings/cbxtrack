import bcrypt from 'bcryptjs'

import userData from '../model/user.js'

export const checkEmailExists = async (req, res) => {
    const { email } = req.body
    try {
        await userData.findOne({ email: email }).then((user_email) => {
            if (user_email) {
                res.status(200).send("The email id is already registered!!")
            }
            else {
                res.status(404).send()
            }
        })
    } catch (error) {
        console.log(error)
    }
}


export const checkPhoneExists = async (req, res) => {
    const { phone } = req.body
    console.log(res)
    try {
        await userData.findOne({ phone: phone }).then((user_phone) => {
            if (user_phone) {

                res.status(200).send("The phone number is already registered!!")
            }
            else {
                res.status(404).send()
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const checkEidExists = async (req, res) => {
    const { emiratesId } = req.body
    try {
        await userData.findOne({ emiratesId: emiratesId }).then((eid) => {
            if (eid) {
                res.status(200).send("The Emirates id is already registered!!")
            }
            else {
                res.status(404).send()
            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const addUser = async (req, res) => {
    const { firstName, LastName, email, phone, emiratesId, employeeId, role, status } = req.body;
    const password = await bcrypt.hash(req.body.password, 10)
    const newUser = new userData({ firstName, LastName, email, phone, emiratesId, employeeId, role, password, status })

    try {
        await newUser.save();
        res.status(201).json({ message: "User added successfully !!" });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const listUser = async (req, res) => {
    try {
        await userData.find()
            .then(users => {
                if (!users) {
                    res.status(204).json("No users found !!")
                }
                else {
                    res.json(users)
                }
            })
            .catch(err => res.status(400).json('Error:' + err))
    } catch (error) {
        res.json({ message: error.message })
    }


}

export const getSingleUser = async (req, res) => {
    try {
        await userData.findById(req.params.id)
            .then(user => {
                if (!user) {
                    res.status(204).json("No such user found !!")
                }
                else {
                    res.json(user)
                }
            })
            .catch(err => res.status(400).json('Error:' + err))
    } catch (error) {
        res.json({ message: error.message })
    }

}


export const updateUser = async (req, res) => {
    const currentUser = req.params.id
    userData.findByIdAndUpdate(currentUser).then((user) => {
        user.firstName = req.body.firstName
        user.LastName = req.body.LastName
        user.email = req.body.email
        user.phone = req.body.phone
        user.emiratesId = req.body.emiratesId
        user.employeeId = req.body.employeeId
        user.role = req.body.role
        user.password = req.body.password
        user.status = req.body.status
        user.save()
            .then(() => {
                res.status(200).json({ message: "User information updated" })
            })
            .catch(err => res.status(400).json('Error:' + err))
    })
}

export const deleteUser = async (req, res) => {
    await userData.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "User deleted successfully" }))
        .catch(err => res.status(400).json('Error:' + err))
}