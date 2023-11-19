import mongoose, { Document, Model } from 'mongoose';

export class DbSvc {
  private mongoDbUrl: string;
  private mongoose: typeof mongoose;
  private db: mongoose.Connection;

  constructor() {
    this.mongoDbUrl =
      process.env.MONGO_DB_URL ||
      `mongodb://localhost:27017/${process.env.MONGO_DB_NAME || 'test'}`;
    this.mongoose = mongoose;
    this.mongoose.connect(this.mongoDbUrl);
    this.db = mongoose.connection;
    this.db.once('open', async () => {
      console.log('Connected to database');
    });
  }

  public async get<D extends Document>(args: {
    model: Model<D>;
    userUUID: string;
    filter?: Partial<mongoose.ObtainDocumentType<D>>;
  }): Promise<D | null> {
    const { userUUID, filter } = args;
    try {
      return !filter
        ? await args.model.findOne({ userUUID })
        : await args.model.findOne({ userUUID, filter });
    } catch (error) {
      console.log('error', error);
      return null;
    }
  }

  public async list<D extends Document>(args: {
    model: Model<D>;
    filter: Partial<mongoose.ObtainDocumentType<D>>;
  }): Promise<D[]> {
    const { filter } = args;
    try {
      return await args.model.find({ filter });
    } catch (error) {
      console.log('error', error);
      return [];
    }
  }

  public async create<D extends Document>(args: {
    model: Model<D>;
    data: mongoose.ObtainDocumentType<D>;
  }): Promise<D | null> {
    const { data } = args;
    try {
      return await args.model.create(data);
    } catch (error) {
      return null;
    }
  }

  public async update<D extends Document>(args: {
    model: Model<D>;
    data: mongoose.ObtainDocumentType<D>;
    id: mongoose.Types.ObjectId;
  }): Promise<D | null> {
    const { id, data } = args;
    try {
      return await args.model.findOneAndUpdate({ _id: id }, data);
    } catch (error) {
      return null;
    }
  }
}
