import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(payload: CreateUserDto): Promise<User> {
    try {
      const user = new this.userModel({
        ...payload,
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
      });

      const savedUser = await user.save();
      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.password;

      return userWithoutPassword;
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAll(page: number, pageSize: number): Promise<User[]> {
    try {
      const skipAmount = (page - 1) * pageSize;

      return this.userModel
        .find({
          $and: [
            { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
          ],
        })
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skipAmount)
        .limit(pageSize)
        .exec();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findById(id): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          $and: [
            { _id: id },
            { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
          ],
        })
        .select('-password')
        .exec();

      if (!user) {
        throw new Error(`Usuário de id: ${id} não encontrado.`);
      }

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(id, payload: CreateUserDto): Promise<User> {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
          { ...payload, updatedAt: new Date() },
          { new: true, runValidators: true },
        )
        .select('-password')
        .exec();

      if (!user) {
        throw new Error(`Usuário de id: ${id} não encontrado.`);
      }
      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async remove(id): Promise<User> {
    try {
      const user = await this.userModel
        .findOneAndUpdate(
          {
            _id: id,
            $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
          },
          { deletedAt: new Date() },
          { new: true },
        )
        .select('-password')
        .exec();

      if (!user) {
        throw new Error(`Usuário de id: ${id} não encontrado.`);
      }

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({
          $and: [
            { email: email },
            { $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }] },
          ],
        })
        .exec();

      if (!user) {
        throw new Error(`Usuário de e-mail: ${email} não encontrado.`);
      }

      return user;
    } catch (err) {
      throw new Error(err);
    }
  }
}
