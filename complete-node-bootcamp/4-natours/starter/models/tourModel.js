const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name is required'],
        unique: true,
        trim: true
    }, 
    slug: {
        type: String
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'MaxGroupSize is required']
    },
    difficulty: {
        type: String,
        required: [true, 'Difficulty is required'],
        trim: true
    },
    ratingsAverage: {
        type: Number,
        default: 4.5
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'Tour price is required']
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'Summary is required']
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'Image cover is required']
    },
    images: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: {
        type: [Date]
    },
    secretTour: {
        type: Boolean,
        default: false
    }
},{
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

tourSchema.virtual('durationWeeks')
            .get(function() {
                return this.duration / 7;
            }
);

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true})
    next();
});

tourSchema.post('save', function(doc, next) {
    // console.log(doc)
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.find({
        secretTour: {
            $ne: true
        }
    });
    next();
});

tourSchema.post(/^find/, function(docs, next) {
    // console.log(docs);
    next();
});

tourSchema.pre('aggregate', function(next) {
    console.log(this);
    this.pipeline().unshift({
        $match: {
            secretTour: {
                $ne: true
            }
        }
    });
    next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;