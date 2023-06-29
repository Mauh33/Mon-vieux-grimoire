const Book = require("../models/book");
const fs = require("fs");

exports.createBook = (req, res, next) => {
  const bookObjet = JSON.parse(req.body.book);
  console.log(bookObjet);
  delete bookObjet._id;
  delete bookObjet._userId;
  const book = new Book({
    ...bookObjet,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  book
    .save()
    .then(() => {
      res.status(201).json({ message: "livre enregistré !" });
    })
    .catch(error => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.modifyBook = (req, res, next) => {
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete bookObject._userId;
  Book.findOne({ _id: req.params.id })
    .then(book => {
      if (book.userId != req.auth.userId) {
        res.status(403).json({ message: "Unauthorized request" });
      } else {
        Book.updateOne(
          { _id: req.params.id },
          { ...bookObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Objet modifié!" }))
          .catch(error => res.status(401).json({ error }));
      }
    })
    .catch(error => {
      res.status(400).json({ error });
    });
};

/* exports.modifyRating = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Le livre n'a pas été trouvé." });
    }

    if (req.body.rating === undefined) {
      book.rating = req.body.rating;
      await book.save();
      return res
        .status(200)
        .json({ message: "La note a été modifiée avec succès." });
    } else {
      return res
        .status(403)
        .json({ message: "Vous avez déjà donné une note à ce livre." });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Une erreur s'est produite lors de la modification de la note.",
    });
  }
}; */

exports.modifyRating = (req, res, next) => {
  const bookObject = JSON.parse(req.body.book);
  bookObject
    .findBy(req.params.id)
    .then(book => {
      if (!book) {
        res.status(404).json({ error: "Le livre n'a pas été trouvé." });
      } else if (req.body.rating == undefined) {
        book.rating = req.body.rating;
        book.save();
        res
          .status(200)
          .json({ message: "La note a été modifiée avec succès." });
      } else {
        res
          .status(403)
          .json({ message: "Vous avez déjà donné une note à ce livre." });
      }
    })
    .catch(error =>
      res.status(500).json({
        error: "Une erreur s'est produite lors de la modification de la note.",
      })
    );
};

exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id }).then(book => {
    if (book.userId != req.auth.userId) {
      res.status(401).json({ message: "Non autorisé" });
    } else {
      const filename = book.imageUrl.split("/images")[1];
      fs.unlink(`images/${filename}`, () => {
        Book.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Livre supprimé" }))
          .catch(error => res.status(401).json({ error }));
      });
    }
  });
};

exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then(book => {
      res.status(200).json(book);
    })
    .catch(error => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.getAllBook = (req, res, next) => {
  Book.find()
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.getBestRating = (req, res, next) => {
  Book.aggregate([
    { $unwind: "$averageRating" },
    { $sort: { averageRating: -1 } },
    { $limit: 3 },
    // { $project: { title: "$title", imageUrl: "$imageUrl" } },
  ])
    .then(books => {
      res.status(200).json(books);
    })
    .catch(error => {
      res.status(400).json({
        error: error,
      });
    });
};
