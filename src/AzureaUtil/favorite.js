var favorite_events_list = {
    preCreateFavorite: [],
    postCreateFavorite: [],
    preDestroyFavorite: [],
    postDestroyFavorite: []
};


function favorite_addEventListener(eventname,  // @param String: preCreateFavorite
                                               //                postCreateFavorite
                                               //                preDestroyFavorite
                                               //                postDestroyFavorite
                                   callback) { // @param Function: callback(Status Object)
                                               //                  When return true in preCreateRetweet or preDestroyFavorite,
                                               //                      stop to create or destroy favorite.
    var events_list = favorite_events_list[eventname],
        i = -1;
    
    if (events_list) {
        while (events_list[++i]) {
            if (events_list[i] === callback) {
                events_list.splice(i, 1);
            }
        }
        events_list.push(callback);
    }
}


function favorite_removeEventListener(eventname,  // @param String: preCreateRetweet
                                                 //                postCreateRetweet
                                     callback) { // @param Function:
    var events_list = favorite_events_list[eventname],
        i = -1;
    
    while (events_list[++i]) {
        if (events_list[i] === callback) {
            events_list.splice(i, 1);
            break;
        }
    }
}


function favorite_create(status_id) { // @param String; status id
    var status = TwitterService.status.get(status_id),
        pre_create_list = favorite_events_list.preCreateFavorite,
        post_create_list = favorite_events_list.posCreatetFavorite,
        is_create_fav = false,
        i = -1;
    
    while (pre_create_list[++i]) {
        is_create_fav = pre_create_list[i](status) || is_create_fav;
    }
    if (!is_create_fav) {
        TwitterService.favorite.create(status_id);
        i = -1;
        while (post_create_list[++i]) {
            post_create_list[i](status);
        }
    }
}


function favorite_destroy(status_id) { // @param String; status id
    var status = TwitterService.status.get(status_id),
        pre_destroy_list = favorite_events_list.preDestroyFavorite,
        post_destroy_list = favorite_events_list.posDestroyFavorite,
        is_destroy_fav = false,
        i = -1;
    
    while (pre_destroy_list[++i]) {
        is_destroy_fav = pre_destroy_list[i](status) || is_destroy_fav;
    }
    if (!is_destroy_fav) {
        TwitterService.favorite.destroy(status_id);
        i = -1;
        while (post_destroy_list[++i]) {
            post_destroy_list[i](status);
        }
    }
}


mixin(AzureaUtil.favorite, {
    addEventListener: favorite_addEventListener,
    removeEventListener: favorite_removeEventListener,
    create: favorite_create,
    destroy: favorite_destroy
});