const express=require('express')
const router=express.Router()
const fs = require('fs');
const path=require('path')
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const knex=require('../db/knex')


const authentication=require('../Middleware/authMiddleware')
const upload = multer({ dest: 'uploads/temp/' }); 


router.post('/upload', authentication, upload.single('media'), async (req, res) => {
  try {
    const type = req.body.type;
    const user = req.user;

    if (!type) return res.status(400).json({ message: 'type is required' });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Create dynamic folder
    const finalPath = path.join(__dirname, '../uploads', String(user.id), type);
    if (!fs.existsSync(finalPath)) fs.mkdirSync(finalPath, { recursive: true });

    // Generate unique filename
    const extension = path.extname(req.file.originalname);
    const newFileName = `${uuidv4()}${extension}`;
    const finalFile = path.join(finalPath, newFileName);

    // Move file from temp to final location
    await fs.promises.rename(req.file.path, finalFile);
    console.log(req)

    const data = {
                    user_id: user.id,
                    type,
                    url: `${req.protocol}://${req.headers.host}/uploads/${user.id}/${type}/${newFileName}`
                 };
    
    if (type === 'profile') {
        
    // Only one profile per user
    const existingProfile = await knex('media')   
      .where({ user_id: user.id, type: 'profile' })
      .first();

    if (existingProfile) {
      // Update existing profile
      await knex('media')
        .where({ user_id: user.id, type: 'profile' })
        .update(data);
    } else {
      // Insert new profile
      await knex('media').insert(data);
    }
  } else {
    // For other media, just insert (can have multiple)
    await knex('media').insert(data);
  }

  // Send response
  res.json({
    message: 'File uploaded successfully',
    path: data.url
  });

} catch (err) {
  console.error(err);
  res.status(500).json({ message: 'Server error', error: err.message });
}
});

router.get('/getprofile',authentication,async(req,res)=>{
    const user = req.user.id;
    const [{name,email,phno}] =await knex('accounts').where({id:user})
    const [{url}] = await knex('media').where({user_id:user}).andWhere('type','profile')
    const data={name,email,phno,url}
    res.status(200).json({data})
})


router.get('/getfiles',authentication,async(req,res)=>{
    const user = req.user.id;
    const [{name,email,phno}] =await knex('accounts').where({id:user})
    const [{url}] = await knex('media').where({user_id:user}).andWhere('type','profile')
    const data={name,email,phno,url}
    res.status(200).json({data})
})


module.exports=router