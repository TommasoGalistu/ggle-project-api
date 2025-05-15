// const Todo = require('../model/toDoModel')

// const todoController = {
//     create: async (req, res) =>{
//         try{
            
//             const todo = new Todo({ description: req.body.description })
//             todo.save()
//             res.status(200).json({message: "Elemento creato con successo"})
//         }catch(error){
//             res.status(400).json({message: error.message})
//         }
//     },
//     delete: async (req, res) =>{
//         try{
            
//             await Todo.deleteOne({ _id: req.body.id});
//             const tasks = await Todo.find().sort({ createdAt: -1});
//             res.status(200).json({message: "Elemento eliminato con successo", tasks})
//         }catch(error){
//             res.status(400).json({error: error.message})
//         }
//     },
//     update: async (req, res) =>{
//         try{
            
//             await Todo.updateOne({ _id: req.body.id}, { description: req.body.description});
//             const todos = await Todo.find().sort({ createdAt: -1 });

//             res.status(200).json({message: "Update avvenuto con successo", todos})
//         }catch(error){
//             res.status(400).json({error: error.message})
//         }
//     }
// }

// module.exports = todoController;