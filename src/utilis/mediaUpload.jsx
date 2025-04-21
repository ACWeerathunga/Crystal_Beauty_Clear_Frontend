import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
      "https://ybnbzquuvpxrntsidbsu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlibmJ6cXV1dnB4cm50c2lkYnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUyNDQ0NjQsImV4cCI6MjA2MDgyMDQ2NH0.sZVk9SQi6MH31zs8wzgVSWQNrawzzVvFGH-EeBnQG-E"
);

export default function mediaUpload(file){
    const promise = new Promise(
        (resolve,reject)=>{
            if(file == null){
                reject("No file selected")
            }
            const timeStamp = new Date().getTime()
            const newFileName = timeStamp+file.name

            supabase.storage.from("images").upload(newFileName, file, {
                cacheControl: "3600",
                upsert: false,
            }).then(
                ()=>{
                    const url = supabase.storage.from("images").getPublicUrl(newFileName).data.publicUrl
                    resolve(url)
                }
            ).catch(
                (error)=>{
                    console.log(error)
                    reject("File upload failed")
                }
            )
        }
    )

    return promise
}