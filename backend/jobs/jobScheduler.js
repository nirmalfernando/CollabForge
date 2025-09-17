import cron from "node-cron";
import TopCreatorJob from "./topCreatorJob.js";
import logger from "../middlewares/logger.js";

class JobScheduler {
  static scheduledJobs = new Map();

  // Schedule the top creators calculation job
  static scheduleTopCreatorsJob() {
    // Run every day at 2:00 AM
    const cronExpression = "0 2 * * *";
    
    const job = cron.schedule(cronExpression, async () => {
      try {
        logger.info("Starting scheduled top creators calculation job");
        
        // Check if update is actually needed
        const shouldUpdate = await TopCreatorJob.shouldUpdate(24); // 24 hours
        
        if (!shouldUpdate) {
          logger.info("Top creators data is still fresh, skipping update");
          return;
        }

        const result = await TopCreatorJob.calculateTopCreators();
        
        logger.info("Scheduled top creators calculation completed", {
          result
        });
        
      } catch (error) {
        logger.error("Scheduled top creators calculation failed", {
          error: error.message,
          stack: error.stack
        });
        
        // Optionally: Send notification to admin about failed job
        // await this.notifyAdminOfFailure(error);
      }
    }, {
      scheduled: false, // Don't start immediately
      timezone: "UTC"
    });

    this.scheduledJobs.set("topCreators", job);
    
    logger.info("Top creators job scheduled", {
      cronExpression,
      timezone: "UTC",
      nextRun: "Daily at 2:00 AM UTC"
    });

    return job;
  }

  // Schedule a one-time job to run immediately (useful for initial setup)
  static async scheduleImmediateTopCreatorsJob() {
    try {
      logger.info("Running immediate top creators calculation");
      
      const result = await TopCreatorJob.calculateTopCreators();
      
      logger.info("Immediate top creators calculation completed", {
        result
      });
      
      return result;
    } catch (error) {
      logger.error("Immediate top creators calculation failed", {
        error: error.message
      });
      throw error;
    }
  }

  // Start all scheduled jobs
  static startAllJobs() {
    logger.info("Starting all scheduled jobs");
    
    // Schedule the top creators job
    const topCreatorsJob = this.scheduleTopCreatorsJob();
    topCreatorsJob.start();
    
    // Add more jobs here as needed
    // const anotherJob = this.scheduleAnotherJob();
    // anotherJob.start();
    
    logger.info(`Started ${this.scheduledJobs.size} scheduled jobs`);
  }

  // Stop all scheduled jobs
  static stopAllJobs() {
    logger.info("Stopping all scheduled jobs");
    
    this.scheduledJobs.forEach((job, name) => {
      job.stop();
      logger.info(`Stopped job: ${name}`);
    });
    
    this.scheduledJobs.clear();
  }

  // Get status of all jobs
  static getJobsStatus() {
    const jobsStatus = {};
    
    this.scheduledJobs.forEach((job, name) => {
      jobsStatus[name] = {
        running: job.running,
        scheduled: job.scheduled
      };
    });
    
    return jobsStatus;
  }

  // Restart a specific job
  static restartJob(jobName) {
    const job = this.scheduledJobs.get(jobName);
    
    if (!job) {
      throw new Error(`Job ${jobName} not found`);
    }
    
    job.stop();
    job.start();
    
    logger.info(`Restarted job: ${jobName}`);
  }

  // Initialize jobs on server startup
  static async initialize() {
    try {
      logger.info("Initializing job scheduler");
      
      // Check if top creators data exists
      const lastUpdate = await TopCreatorJob.getLastUpdateTime();
      
      if (!lastUpdate) {
        logger.info("No existing top creators data found, running initial calculation");
        await this.scheduleImmediateTopCreatorsJob();
      } else {
        const shouldUpdate = await TopCreatorJob.shouldUpdate(24);
        if (shouldUpdate) {
          logger.info("Top creators data is outdated, running update");
          await this.scheduleImmediateTopCreatorsJob();
        }
      }
      
      // Start scheduled jobs
      this.startAllJobs();
      
      logger.info("Job scheduler initialized successfully");
      
    } catch (error) {
      logger.error("Failed to initialize job scheduler", {
        error: error.message
      });
      throw error;
    }
  }

  // Graceful shutdown
  static async shutdown() {
    logger.info("Shutting down job scheduler");
    
    this.stopAllJobs();
    
    logger.info("Job scheduler shutdown completed");
  }

  // Optional: Notify admin of job failures (implement based on your notification system)
  static async notifyAdminOfFailure(error) {
    // Example implementation - customize based on your notification system
    logger.error("ADMIN NOTIFICATION: Critical job failure", {
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    // You could integrate with email service, Slack, Discord, etc.
    // await emailService.sendAlert({
    //   to: "admin@yourcompany.com",
    //   subject: "Critical Job Failure - Top Creators Calculation",
    //   body: `Job failed at ${new Date()}: ${error.message}`
    // });
  }
}

export default JobScheduler;