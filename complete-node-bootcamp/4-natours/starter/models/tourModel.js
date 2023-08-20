const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name is required'],
        unique: true,
        trim: true,
        // validate: [validator.isAlpha, 'Tour name must contain only chars']
        // maxlength: [5, 'Tour name must be less than 5 characters']
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
        trim: true,
        enum: {
            values: ['easy', 'medium', 'difficult'], 
            message: 'Difficulty is either: easy, medium or difficult'
        }
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
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price;
            },
            message: props => `${props.value} should be less than ${this.price}`
    }
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
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: Array
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

tourSchema.pre('save', async function(next) {
    const guidesPromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidesPromises);
    next();
})

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