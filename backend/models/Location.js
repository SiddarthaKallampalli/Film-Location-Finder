const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    movie: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    images: [
      {
        type: String,
        validate: {
          validator: function(value) {
            return /\.(jpg|jpeg|png|gif)$/i.test(value);
          },
          message: props => `${props.value} is not a valid image format!`
        }
      }
    ]
  },
  { timestamps: true }
);

// Text index for search
LocationSchema.index({ name: 'text', description: 'text', movie: 'text' });

module.exports = mongoose.model('Location', LocationSchema);
