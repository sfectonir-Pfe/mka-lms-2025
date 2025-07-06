admins = {
    

    
    "jibri@auth.meet.jitsi.local",
    

    "focus@auth.meet.jitsi.local",
    "jvb@auth.meet.jitsi.local"
}

unlimited_jids = {
    "focus@auth.meet.jitsi.local",
    "jvb@auth.meet.jitsi.local"
}

plugin_paths = { "/prosody-plugins/", "/prosody-plugins-custom", "/prosody-plugins-contrib" }

muc_mapper_domain_base = "meet.jitsi.local";
muc_mapper_domain_prefix = "muc";

recorder_prefixes = { "recorder@hidden.meet.jitsi" };

http_default_host = "meet.jitsi.local"





consider_bosh_secure = true;
consider_websocket_secure = true;





VirtualHost "meet.jitsi.local"

    authentication = "jitsi-anonymous"

    ssl = {
        key = "/config/certs/meet.jitsi.local.key";
        certificate = "/config/certs/meet.jitsi.local.crt";
    }
    modules_enabled = {
        "bosh";
        
        "speakerstats";
        "conference_duration";
        "room_metadata";
        
        "end_conference";
        
        
        "muc_lobby_rooms";
        
        
        "muc_breakout_rooms";
        
        
        "av_moderation";
        
        
        
        
        

    }

    main_muc = "muc.meet.jitsi.local"
    room_metadata_component = "metadata.meet.jitsi.local"
    
    lobby_muc = "lobby.meet.jitsi.local"
    
    muc_lobby_whitelist = { "hidden.meet.jitsi" }
    
    

    

    
    breakout_rooms_muc = "breakout.meet.jitsi.local"
    

    speakerstats_component = "speakerstats.meet.jitsi.local"
    conference_duration_component = "conferenceduration.meet.jitsi.local"

    
    end_conference_component = "endconference.meet.jitsi.local"
    

    
    av_moderation_component = "avmoderation.meet.jitsi.local"
    

    c2s_require_encryption = true

    

    

VirtualHost "auth.meet.jitsi.local"
    ssl = {
        key = "/config/certs/auth.meet.jitsi.local.key";
        certificate = "/config/certs/auth.meet.jitsi.local.crt";
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


Component "internal-muc.meet.jitsi" "muc"
    storage = "memory"
    modules_enabled = {
        "muc_hide_all";
        "muc_filter_access";
        }
    restrict_room_creation = true
    muc_filter_whitelist="auth.meet.jitsi.local"
    muc_room_locking = false
    muc_room_default_public_jids = true
    muc_room_cache_size = 1000
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "muc.meet.jitsi.local" "muc"
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
        "focus@auth.meet.jitsi.local";
        "recorder@hidden.meet.jitsi";
    }
    muc_tombstones = false
    muc_room_allow_persistent = false

Component "focus.meet.jitsi.local" "client_proxy"
    target_address = "focus@auth.meet.jitsi.local"

Component "speakerstats.meet.jitsi.local" "speakerstats_component"
    muc_component = "muc.meet.jitsi.local"

Component "conferenceduration.meet.jitsi.local" "conference_duration_component"
    muc_component = "muc.meet.jitsi.local"


Component "endconference.meet.jitsi.local" "end_conference"
    muc_component = "muc.meet.jitsi.local"



Component "avmoderation.meet.jitsi.local" "av_moderation_component"
    muc_component = "muc.meet.jitsi.local"



Component "lobby.meet.jitsi.local" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_tombstones = false
    muc_room_allow_persistent = false
    muc_room_cache_size = 10000
    muc_room_locking = false
    muc_room_default_public_jids = true
    modules_enabled = {
        "muc_hide_all";
    }

    


Component "breakout.meet.jitsi.local" "muc"
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


Component "metadata.meet.jitsi.local" "room_metadata_component"
    muc_component = "muc.meet.jitsi.local"
    breakout_rooms_component = "breakout.meet.jitsi.local"



