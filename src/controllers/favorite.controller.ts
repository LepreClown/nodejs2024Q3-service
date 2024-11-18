import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoriteService } from '../services/favorite.service';
import { TFavorite } from '../types/favorite.types';

@Controller('favs')
export class FavoriteController {
  constructor(private readonly favorites: FavoriteService) {}

  @Get()
  async fetchAll() {
    return this.favorites.fetchAllFavorites();
  }

  @Post(':type/:id')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @Param('type') type: TFavorite,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.ensureExists(id, type);
    return this.favorites.addFavoriteItem(id, type);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFavorite(
    @Param('type') type: TFavorite,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.ensureInFavorites(id, type);
    return this.favorites.removeFavoriteItem(id, type);
  }

  private async ensureExists(id: string, type: TFavorite) {
    if (!(await this.favorites.itemExists(id, type))) {
      throw new UnprocessableEntityException(
        `${type} with ID "${id}" does not exist.`,
      );
    }
  }

  private async ensureInFavorites(id: string, type: TFavorite) {
    if (!(await this.favorites.isFavorite(id, type))) {
      throw new NotFoundException(
        `${type} with ID "${id}" is not in favorites.`,
      );
    }
  }
}
