admins = {
    

    
    "jibri@auth.51.83.75.65",
    

    "focus@auth.51.83.75.65",
    "jvb@auth.51.83.75.65"
}

unlimited_jids = {
    "focus@auth.51.83.75.65",
    "jvb@auth.51.83.75.65"
}

plugin_paths = { "/prosody-plugins/", "/prosody-plugins-custom", "/prosody-plugins-contrib" }

muc_mapper_domain_base = "51.83.75.65";
muc_mapper_domain_prefix = "muc";

recorder_prefixes = { "recorder@hidden.meet.jitsi" };

http_default_host = "51.83.75.65"





consider_bosh_secure = true;
consider_websocket_secure = true;


smacks_max_unacked_stanzas = 5;
smacks_hibernation_time = 60;
smacks_max_old_sessions = 1;




VirtualHost "51.83.75.65"

    authentication = "jitsi-anonymous"

    ssl = {
        key = "/config/certs/51.83.75.65.key";
        certificate = "/config/certs/51.83.75.65.crt";
    }
    modules_enabled = {
        "bosh";
        
        "websocket";
        "smacks"; -- XEP-0198: Stream Management
        
        "speakerstats";
        "conference_duration";
        "room_metadata";
        
        "end_conference";
        
        
        
        "muc_breakout_rooms";
        
        
        "av_moderation";
        
        
        
        
        

    }

    main_muc = "muc.51.83.75.65"
    room_metadata_component = "metadata.51.83.75.65"
    

    

    
    breakout_rooms_muc = "breakout.51.83.75.65"
    

    speakerstats_component = "speakerstats.51.83.75.65"
    conference_duration_component = "conferenceduration.51.83.75.65"

    
    end_conference_component = "endconference.51.83.75.65"
    

    
    av_moderation_component = "avmoderation.51.83.75.65"
    

    c2s_require_encryption = true

    

    

VirtualHost "auth.51.83.75.65"
    ssl = {
        key = "/config/certs/auth.51.83.75.65.key";
        certificate = "/config/certs/auth.51.83.75.65.crt";
    }
    modules_enabled = {
        "limits_exception";
        "smacks";
    }
    authentication = "internal_hashed"
    smacks_hibernation_time = 15;


VirtualHost "hidden.meet.jitsi"
    modules_enabled = {
      "smacks";
    }
    authentication = "internal_hashed"


Component "internal-muc.51.83.75.65" "muc"
    storage = "memory"
    modules_enabled = {
        "muc_hide_all";
        "muc_filter_access";
        }
    restrict_room_creation = true
    muc_filter_whitelist="auth.51.83.75.65"
    muc_room_locking = false
    muc_room_default_public_jids = true
    muc_room_cache_size = 1000
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "muc.51.83.75.65" "muc"
    restrict_room_creation = true
    storage = "memory"
    modules_enabled = {
        "muc_hide_all";
        "muc_meeting_id";
        
        "polls";
        "muc_domain_mapper";
        
        "muc_password_whitelist";
        
    }

    -- The size of the cache that saves state for IP addresses
    rate_limit_cache_size = 10000;

    muc_room_cache_size = 10000
    muc_room_locking = false
    muc_room_default_public_jids = true
    
    muc_password_whitelist = {
        "focus@auth.51.83.75.65";
        "recorder@hidden.meet.jitsi";
    }
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "focus.51.83.75.65" "client_proxy"
    target_address = "focus@auth.51.83.75.65"

Component "speakerstats.51.83.75.65" "speakerstats_component"
    muc_component = "muc.51.83.75.65"

Component "conferenceduration.51.83.75.65" "conference_duration_component"
    muc_component = "muc.51.83.75.65"


Component "endconference.51.83.75.65" "end_conference"
    muc_component = "muc.51.83.75.65"



Component "avmoderation.51.83.75.65" "av_moderation_component"
    muc_component = "muc.51.83.75.65"





Component "breakout.51.83.75.65" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_room_cache_size = 10000
    muc_room_locking = false
    muc_room_default_public_jids = true
    muc_tombstones = false
    muc_room_allow_persistent = false
    modules_enabled = {
        "muc_hide_all";
        "muc_meeting_id";
        "polls";
        }


Component "metadata.51.83.75.65" "room_metadata_component"
    muc_component = "muc.51.83.75.65"
    breakout_rooms_component = "breakout.51.83.75.65"



