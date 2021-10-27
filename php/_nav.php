<nav class="navbar navbar-expand-lg navbar-dark no-select">
    <div class=" container-fluid">
        <a class="navbar-brand text-bm nav-name" href="/kiu">KIU</a>
        <ul class="navbar-nav flex-row mb-lg-0">
            <?php if ($_USER_ID < 1) { ?>
                <li class="nav-item d-inline-block mx-1">
                    <a class="btn-icon animated link-light" href="#lang"><i class="fas fa-globe"></i></a>
                </li>
                <li class="nav-item d-inline-block mx-1">
                    <a class="btn-icon animated link-light" href="#signin"><i class="fas fa-user"></i></a>
                </li>
            <?php } else { ?>
                <li class="nav-item d-none d-md-inline-block mx-1">
                    <a class="nav-link text-white"><?php out($_USER_INFO['full_name']); ?></a>
                </li>
                <?php if ($_TEST) { ?>
                    <li class="nav-item d-inline-block mx-1">
                        <a class="btn-icon animated link-success" href="#reload"><i class="fas fa-sync-alt"></i></a>
                    </li>
                <?php } ?>
                <li class="nav-item view-toggle mx-1" id="view_day" style="display: none;">
                    <a class="btn-icon animated link-bm" href="#view:day"><i class="fas fa-window-maximize day-icon"></i></a>
                </li>
                <li class="nav-item view-toggle mx-1" id="view_week" style="display: none;">
                    <a class="btn-icon animated link-bm" href="#view:week"><i class="fas fa-th-list"></i></a>
                </li>
                <li class="nav-item d-inline-block mx-1">
                    <a class="btn-icon animated link-light" href="#calendar"><i class="fas fa-calendar-alt"></i></a>
                </li>
                <li class="nav-item d-inline-block mx-1">
                    <a class="btn-icon animated link-light" href="#search"><i class="fas fa-search"></i></a>
                </li>
                <li class="nav-item d-inline-block mx-1">
                    <a class="btn-icon animated link-light" href="#settings"><i class="fas fa-ellipsis-h"></i></a>
                </li>
            <?php } ?>
        </ul>
    </div>
</nav>

<?php if ($_USER_ID < 1) { ?>
    <form method="post">
        <div class="modal fade" tabindex="-1" id="sign_in">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 data-lang="sign_in" class="modal-title"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <?php if ($sign_in_result == 0) { ?>
                            <div data-lang="sign_in_fail_api" class="alert alert-warning" role="alert"></div>
                        <?php } ?>
                        <?php if ($sign_in_result == 2) { ?>
                            <div data-lang="sign_in_fail" class="alert alert-warning" role="alert"></div>
                        <?php } ?>
                        <div class="mb-3">
                            <label data-lang="username" for="s_user" class="form-label"></label>
                            <input type="text" class="form-control" id="s_user" name="s_user" placeholder="@student" spellcheck="false">
                        </div>
                        <div class="mb-3">
                            <label data-lang="password" for="s_pass" class="form-label"></label>
                            <input type="password" class="form-control" id="s_pass" name="s_pass">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <input data-lang="sign_in" data-lang-attr="value" id="s_btn" type="submit" class="btn btn-outline-bm">
                    </div>
                </div>
            </div>
        </div>
    </form>
<?php } ?>