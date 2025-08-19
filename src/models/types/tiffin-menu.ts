export type TiffinMenuDocument = {
  _id: string;
  // store: mongoose.Schema.Types.ObjectId;
  pickup: {
    '2_weeks': number;
    '3_weeks': number;
    '4_weeks': number;
  };
  delivery: {
    '2_weeks': number;
    '3_weeks': number;
    '4_weeks': number;
  };
};
