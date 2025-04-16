import { Request, Response } from 'express';
import { Article } from '../models/article.model';
import { deleteFromCloudinary, uploadToCloudinary } from '../utils/cloudinary';
import { IUser } from '../models/user.model';
import { NextFunction } from 'express';

interface IArticle {
  title: string;
  content: string;
  coverImage?: {
    publicId: string;
    url: string;
  };
  author: {
    id: string;
    name: string;
  };
}

interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const createArticle = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { title, content, coverImage } = req.body;
    const userId = req.user?.id;
    const userName = req.user?.name;

    let coverImageUrl = null;
    let coverImagePublicId = null;

    if (coverImage) {
      const result = await uploadToCloudinary(coverImage);
      coverImageUrl = result.secure_url;
      coverImagePublicId = result.public_id;
    }

    const article = new Article({
      title,
      content,
      coverImage: coverImage ? {
        publicId: coverImagePublicId,
        url: coverImageUrl
      } : undefined,
      author: {
        id: userId,
        name: userName
      }
    });

    const savedArticle = await article.save();

    res.json({
      success: true,
      message: 'Article créé avec succès',
      data: savedArticle
    });
  } catch (error: any) {
    console.error('Error creating article:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la création de l\'article'
    });
  }
};

export const getArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await Article.find()
      .populate('author.id', 'name')
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (error: any) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la récupération des articles'
    });
  }
};

export const getArticleById = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id)
      .populate('author.id', 'name');

    if (!article) {
      res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Article récupéré avec succès',
      data: article
    });
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'article'
    });
  }
};

export const updateArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, summary, content, coverImage } = req.body;

    const article = await Article.findById(id);
    if (!article) {
      res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
      return;
    }

    if (article.coverImage?.publicId && coverImage) {
      await deleteFromCloudinary(article.coverImage.publicId);
    }

    let coverImageUrl = article.coverImage?.url;
    let coverImagePublicId = article.coverImage?.publicId;

    if (coverImage) {
      const result = await uploadToCloudinary(coverImage);
      coverImageUrl = result.secure_url;
      coverImagePublicId = result.public_id;
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      {
        title,
        summary,
        content,
        coverImage: coverImage ? {
          publicId: coverImagePublicId,
          url: coverImageUrl
        } : undefined
      },
      { new: true }
    ).populate('author.id', 'name');

    res.json({
      success: true,
      message: 'Article mis à jour avec succès',
      data: updatedArticle
    });
  } catch (error: any) {
    console.error('Error updating article:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour de l\'article'
    });
  }
};

export const deleteArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      res.status(404).json({
        success: false,
        message: 'Article non trouvé'
      });
      return;
    }

    if (article.coverImage?.publicId) {
      await deleteFromCloudinary(article.coverImage.publicId);
    }

    await Article.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Article supprimé avec succès'
    });
  } catch (error: any) {
    console.error('Error deleting article:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la suppression de l\'article'
    });
  }
};
