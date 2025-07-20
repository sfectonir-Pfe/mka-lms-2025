-- CreateTable
CREATE TABLE "SeanceFeedback" (
    "id" SERIAL NOT NULL,
    "seanceId" INTEGER NOT NULL,
    "userId" INTEGER,
    "sessionRating" INTEGER NOT NULL,
    "contentQuality" INTEGER NOT NULL,
    "sessionDuration" TEXT NOT NULL,
    "sessionOrganization" INTEGER NOT NULL,
    "objectivesAchieved" INTEGER NOT NULL,
    "trainerRating" INTEGER NOT NULL,
    "trainerClarity" INTEGER NOT NULL,
    "trainerAvailability" INTEGER NOT NULL,
    "trainerPedagogy" INTEGER NOT NULL,
    "trainerInteraction" INTEGER NOT NULL,
    "teamRating" INTEGER NOT NULL,
    "teamCollaboration" INTEGER NOT NULL,
    "teamParticipation" INTEGER NOT NULL,
    "teamCommunication" INTEGER NOT NULL,
    "sessionComments" TEXT,
    "trainerComments" TEXT,
    "teamComments" TEXT,
    "suggestions" TEXT,
    "wouldRecommend" TEXT,
    "improvementAreas" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeanceFeedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionFeedback" (
    "id" SERIAL NOT NULL,
    "sessionId" INTEGER NOT NULL,
    "userId" INTEGER,
    "rating" INTEGER NOT NULL,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SessionFeedback_pkey" PRIMARY KEY ("id")
);
