const mongoose = require("mongoose");
    const freelanceServiceSchema = new mongoose.Schema({

        candidate:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"Candidate",
          required:true,
          index:true
        },
      
        title:{
          type:String,
          required:true
        },
      
    skills:{
        type:[String],
        default:[]
      },
        description:String,
        isPremium:{
            type:Boolean,
            default:false,
          },
        category:{
          type:String,
          index:true
        },
      
      
        price:String,
      
   
      
        rating:{
          type:Number,
          default:0
        },
      
        ranking:{
          type:Number,
          default:0
        },
      
        views:{
          type:Number,
          default:0
        },
      
        clicks:{
          type:Number,
          default:0
        },
      
        workSamples:[
          {
            title:String,
            description:String,
            link:String
          }
        ],
        location:{
            type:{
              type:String,
              enum:["Point"]
            },
            coordinates:{
              type:[Number] // [longitude, latitude]
            }
          },
          
          place:{
            type:String
          },
        isActive:{
          type:Boolean,
          default:true
        }
      
      },{timestamps:true})
      freelanceServiceSchema.index({ location: "2dsphere" });
      module.exports = mongoose.model("FreelanceService", freelanceServiceSchema);