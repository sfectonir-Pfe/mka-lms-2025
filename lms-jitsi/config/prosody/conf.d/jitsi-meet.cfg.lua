admins = {
    

    
    "jibri@auth.localhost",
    

    "focus@auth.localhost",
    "jvb@auth.localhost"
}

unlimited_jids = {
    "focus@auth.localhost",
    "jvb@auth.localhost"
}

plugin_paths = { "/prosody-plugins/", "/prosody-plugins-custom", "/prosody-plugins-contrib" }

muc_mapper_domain_base = "localhost";
muc_mapper_domain_prefix = "muc";

recorder_prefixes = { "recorder@hidden.meet.jitsi" };

http_default_host = "localhost"





consider_bosh_secure = true;
consider_websocket_secure = true;





VirtualHost "localhost"

    authentication = "jitsi-anonymous"

    ssl = {
        key = "/config/certs/localhost.key";
        certificate = "/config/certs/localhost.crt";
    }
    modules_enabled = {
        "bosh";
        
        "speakerstats";
        "conference_duration";
        "room_metadata";
        
        "end_conference";
        
        
        
        "muc_breakout_rooms";
        
        
        "av_moderation";
        
        
        
        
        

    }

    main_muc = "muc.localhost"
    room_metadata_component = "metadata.localhost"
    

    

    
    breakout_rooms_muc = "breakout.localhost"
    

    speakerstats_component = "speakerstats.localhost"
    conference_duration_component = "conferenceduration.localhost"

    
    end_conference_component = "endconference.localhost"
    

    
    av_moderation_component = "avmoderation.localhost"
    

    c2s_require_encryption = true

    

    

VirtualHost "auth.localhost"
    ssl = {
        key = "/config/certs/auth.localhost.key";
        certificate = "/config/certs/auth.localhost.crt";
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


Component "internal-muc.localhost" "muc"
    storage = "memory"
    modules_enabled = {
        "muc_hide_all";
        "muc_filter_access";
        }
    restrict_room_creation = true
    muc_filter_whitelist="auth.localhost"
    muc_room_locking = false
    muc_room_default_public_jids = true
    muc_room_cache_size = 1000
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "muc.localhost" "muc"
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
        "focus@auth.localhost";
        "recorder@hidden.meet.jitsi";
    }
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "focus.localhost" "client_proxy"
    target_address = "focus@auth.localhost"

Component "speakerstats.localhost" "speakerstats_component"
    muc_component = "muc.localhost"

Component "conferenceduration.localhost" "conference_duration_component"
    muc_component = "muc.localhost"


Component "endconference.localhost" "end_conference"
    muc_component = "muc.localhost"



Component "avmoderation.localhost" "av_moderation_component"
    muc_component = "muc.localhost"





Component "breakout.localhost" "muc"
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


Component "metadata.localhost" "room_metadata_component"
    muc_component = "muc.localhost"
    breakout_rooms_component = "breakout.localhost"



