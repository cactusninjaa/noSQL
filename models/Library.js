import mongoose, { Types } from "mongoose";
//- name string required
// - localisation string required
// - stock int required

const LibrarySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    localisation: {
        type: String,
        required: true
    }
})

LibrarySchema.index(
    { name: "text"}
);


const Library = mongoose.model("Library", LibrarySchema);
export default Library