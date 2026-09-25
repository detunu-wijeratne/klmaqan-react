<?php
/**
 * KLMAQAN Headless API additions.
 *
 * Your "project" post type and taxonomies are already exposed nicely over
 * REST (rest_base "projects", ACF fields under `acf`, resolved taxonomy
 * terms under `project_taxonomies`, and `featured_image`) — nothing to fix
 * there. This file only adds the two things your setup doesn't have yet:
 *
 *   1. CORS headers so the React app (a different origin) is allowed to
 *      call your REST API.
 *   2. A POST /wp-json/klmaqan/v1/enquiry endpoint for the enquiry form,
 *      which emails the site admin via wp_mail().
 *
 * WHERE TO PUT THIS:
 * Create wp-content/mu-plugins/ (if it doesn't exist) and drop this file
 * in directly. mu-plugins load automatically, no activation needed.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * =========================================================================
 * CORS — allow your React app's origin to call the REST API
 * =========================================================================
 * Replace the origins below with your actual dev + production React URLs.
 */
add_action( 'rest_api_init', function () {
    remove_filter( 'rest_pre_serve_request', 'rest_send_cors_headers' );

    add_filter( 'rest_pre_serve_request', function ( $value ) {
        $allowed_origins = [
            'http://localhost:5173',              // Vite dev server
            'https://your-react-app-domain.com',   // TODO: replace with production URL
        ];

        $origin = get_http_origin();

        if ( $origin && in_array( $origin, $allowed_origins, true ) ) {
            header( 'Access-Control-Allow-Origin: ' . esc_url_raw( $origin ) );
            header( 'Access-Control-Allow-Methods: GET, POST, OPTIONS' );
            header( 'Access-Control-Allow-Credentials: true' );
            header( 'Access-Control-Allow-Headers: Content-Type, X-WP-Nonce' );
        }

        return $value;
    } );
}, 15 );

/**
 * =========================================================================
 * ENQUIRY FORM ENDPOINT
 * =========================================================================
 * POST /wp-json/klmaqan/v1/enquiry
 * body: { "name": "...", "email": "...", "phone": "...", "message": "...", "project_title": "...", "project_url": "..." }
 * Sends an email to the site admin via wp_mail(). Swap this out for
 * Contact Form 7's REST endpoint if you'd rather keep using CF7.
 */
add_action( 'rest_api_init', function () {
    register_rest_route( 'klmaqan/v1', '/enquiry', [
        'methods'             => 'POST',
        'permission_callback' => '__return_true',
        'callback'            => function ( WP_REST_Request $request ) {
            $name    = sanitize_text_field( $request->get_param( 'name' ) );
            $email   = sanitize_email( $request->get_param( 'email' ) );
            $phone   = sanitize_text_field( $request->get_param( 'phone' ) );
            $message = sanitize_textarea_field( $request->get_param( 'message' ) );
            $project = sanitize_text_field( $request->get_param( 'project_title' ) );
            $project_url = esc_url_raw( $request->get_param( 'project_url' ) );

            if ( empty( $name ) || empty( $email ) ) {
                return new WP_Error( 'missing_fields', 'Name and email are required.', [ 'status' => 400 ] );
            }

            $to      = get_option( 'admin_email' );
            $subject = sprintf( 'New enquiry: %s', $project ?: 'General' );
            $body    = "Name: {$name}\nEmail: {$email}\nPhone: {$phone}\nProject: {$project} ({$project_url})\n\nMessage:\n{$message}";
            $headers = [ 'Content-Type: text/plain; charset=UTF-8', "Reply-To: {$name} <{$email}>" ];

            $sent = wp_mail( $to, $subject, $body, $headers );

            if ( ! $sent ) {
                return new WP_Error( 'mail_failed', 'Could not send the enquiry. Please try again.', [ 'status' => 500 ] );
            }

            return [ 'success' => true ];
        },
    ] );
} );
