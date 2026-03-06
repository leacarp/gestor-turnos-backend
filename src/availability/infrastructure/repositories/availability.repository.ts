import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAvailabilityRepository } from 'src/availability/domain/interfaces/IAvailabilityRepository';
import { WeeklyScheduleEntity } from 'src/availability/domain/entities/weeklySchedule.entity';
import { AvailabilityExceptionEntity } from 'src/availability/domain/entities/availabilityException.entity';
import { WeeklySchedule as WeeklyScheduleSchema, WeeklyScheduleDocument } from '../schemas/weeklySchedule.schema';
import { AvailabilityException as AvailabilityExceptionSchema, AvailabilityExceptionDocument } from '../schemas/availabilityException.schema';

@Injectable()
export class AvailabilityRepository implements IAvailabilityRepository {
  constructor(
    @InjectModel(WeeklyScheduleSchema.name) private weeklyModel: Model<WeeklyScheduleDocument>,
    @InjectModel(AvailabilityExceptionSchema.name) private exceptionModel: Model<AvailabilityExceptionDocument>,
  ) {}

  // --- Weekly Schedule ---
  
  async createSchedule(data: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity> {
    const doc = await this.weeklyModel.create({
      providerId: data.getProviderId(),
      slots: data.getSlots(),
    });
    return this.toWeeklyEntity(doc);
  }
  
  async findScheduleByProvider(providerId: string): Promise<WeeklyScheduleEntity | null> {
    const doc = await this.weeklyModel.findOne({ providerId }).exec();
    return doc ? this.toWeeklyEntity(doc) : null;
  }
  
  async updateSchedule(providerId: string, data: WeeklyScheduleEntity): Promise<WeeklyScheduleEntity | null> {
    const doc = await this.weeklyModel.findOneAndUpdate(
      { providerId },
      { $set: { slots: data.getSlots() } },
      { new: true },
    ).exec();
    return doc ? this.toWeeklyEntity(doc) : null;
  }
  
  // --- Exceptions ---
  
  async createException(data: AvailabilityExceptionEntity): Promise<AvailabilityExceptionEntity> {
    const doc = await this.exceptionModel.create({
      providerId: data.getProviderId(),
      date: new Date(Date.UTC(
      data.getDate().getFullYear(),
      data.getDate().getMonth(),
      data.getDate().getDate(),
      )),
      type: data.getType(),
      customSlots: data.getCustomSlots(),
      reason: data.getReason(),
    });
    return this.toExceptionEntity(doc);
  }
  
  async findExceptionByDate(providerId: string, date: Date): Promise<AvailabilityExceptionEntity | null> {
    const start = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    const end = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59));

    const doc = await this.exceptionModel.findOne({
      providerId,
      date: { $gte: start, $lte: end },
    }).exec();

    return doc ? this.toExceptionEntity(doc) : null;
  }
  
  async findExceptionsByMonth(providerId: string, year: number, month: number): Promise<AvailabilityExceptionEntity[]> {
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);
    
    const docs = await this.exceptionModel.find({
      providerId,
      date: { $gte: start, $lte: end },
    }).exec();
    return docs.map(doc => this.toExceptionEntity(doc));
  }
  
  async deleteException(exceptionId: string): Promise<boolean> {
    const result = await this.exceptionModel.findByIdAndDelete(exceptionId).exec();
    return result !== null;
  }
  

  private toWeeklyEntity(doc: WeeklyScheduleDocument): WeeklyScheduleEntity {
    return new WeeklyScheduleEntity(
      doc.providerId.toString(),
      doc.slots,
      doc._id.toString(),
      doc.createdAt,
      doc.updatedAt,
    );
  }
  
  private toExceptionEntity(doc: AvailabilityExceptionDocument): AvailabilityExceptionEntity {
    return new AvailabilityExceptionEntity(
      doc.providerId.toString(),
      doc.date,
      doc.type,
      doc._id.toString(),
      doc.customSlots,
      doc.reason,
      doc.createdAt,
      doc.updatedAt,
    );
  }


}