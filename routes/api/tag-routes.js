const router = require('express').Router();
const res = require('express/lib/response');
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint



// find all tags
router.get('/', (req, res) => {
  // be sure to include its associated Product data
  Tag.findAll({
    include: [
      {
       model: Product, through: ProductTag,
       attributes: ['id', 'product_name', 'price', 'stock'],
    }],
    
  })
  .then(dbTagData => {
    if (!dbTagData) {
      res.status(404).json({ message: 'No tag found with this id' });
      return
    }
    res.status(200).json(dbTagData);
  })
  .catch (err => {
    console.log(err);
    res.status(500).json(err);
  });
});  



// find a single tag by its `id`
router.get('/:id', (req, res) => {
  
  // be sure to include its associated Product data
  console.log(req.params.id);
  
  Tag.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'product_name', 'price', 'stock'],
    include: [
      {
        model: Product, through: ProductTag,
        attributes: ['product_name'],
      },
      { model: Tag, through: ProductTag,
        attributes: ['tag_name'],
    }
  ],
  })
    .then(dbTagData => {
      if (!dbTagData) {
        res.status(404).json({ message: 'No Tag found with this id' });
          return;
      }
      res.json(dbTagData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


// create a new tag
  /* req.body should look like this...
    {
      tag_name: "Basketball",
      
    }
  */

router.post('/', async (req, res) => {
    try {
      const tagData = await Tag.create(req.body);
      res.status(200).json(tagData);
    } catch (err) {
      res.status(400).json(err);
    }
  });
    
    
// update a tag's name by its `id` value

router.put('/:id', async (req, res) => {
  // update tag data
  try {
    const tagData = await Tag.update(req.body, {
      where: { id: req.params.id }
    });
    if (!tagData) {
      res.status(404).json({ message: ' No tag with this id!' });
      return; 
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});



router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;